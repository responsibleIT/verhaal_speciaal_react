import React, {
  useRef,
  useEffect,
  useContext,
  useState,
  MouseEvent,
  useCallback,
} from "react";
import Matter from "matter-js";
import { BoxContext } from "../contexts/boxContext";
import Microphone, { ellipse } from "../atoms/microphone";
import { BoxStateContext } from "../contexts/boxStateContext";
import { RecordedTextContext } from "../contexts/recordedTextContext";
import {
  calculateBoxData,
  generateRandomCoordinates,
} from "../utils/boxHelper";
import Bubble, { BoxObject } from "./bubble";
import { SettingContext } from "../contexts/storyContext";
import { LoaderContext } from "../contexts/loaderContext";
import { ButtonType, PageType } from "../types";
import Button from "../atoms/Button";
import "@/globals.css";
import _ from "lodash";

interface PhysicsComponentProps {
  page: PageType;
  handleClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const PhysicsComponent = ({ page, handleClick }: PhysicsComponentProps) => {
  //reffrence for div that will serve as canvas
  const sceneRef = useRef<HTMLDivElement>(null);
  //captured boxes context, to track which boxes have been added to the center orb and which have not
  const { capturedBoxes, addCapturedBox, removeCapturedBox } =
    useContext(BoxContext);
  //context for tracking the recorded texts
  const { recordedText, clearRecordedText, addRecordedText } =
    useContext(RecordedTextContext);
  //used for tracking the positions of each box to be able to place a div on top
  const { states, updatePositions, getBoxProps, clearStates } =
    useContext(BoxStateContext);
  //used for tracking on which step of the oboarding process we are
  const { step, characters, setting } = useContext(SettingContext);
  //used to check if loading animation should be active
  const { loading, setLoading } = useContext(LoaderContext);
  //used for tracking which boxes are not captured
  const [uncapturedBoxes, setUncapturedBoxes] = useState<Matter.Body[]>([]);
  //all classes used for the wheelpicker

  const orbref = useRef<HTMLDivElement>(null);
  const [orbDementions, setOrbDementions] = useState<number>(300);
  useEffect(() => {
    const newDementions = (Math.max(orbref.current?.getBoundingClientRect().height || 300, orbref.current?.getBoundingClientRect().width || 300)) + 100;
    setOrbDementions(newDementions);
  }, [capturedBoxes])
  
  const orbText = (page: PageType) => {
    const innerText = page === "setting" ? "naar..." : "is...";
    const outerText =
      page === "setting"
        ? "Laten we gaan"
        : page === "character"
          ? "Dat"
          : page === "attributes"
            ? "Die"
            : "";
    return (
      <p className="text-white text-h4 no-drag pointer-events-none max-w-[200px]">
        {outerText} <span className="text-limeLight">{innerText}</span>
      </p>
    );
  };

  const [windowDimensions, setWindowDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  //function to create a boundary
  const boundary = (x: number, y: number, width: number, height: number) => {
    return Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: { fillStyle: "transparent" },
    });
  };
  const orb = Matter.Bodies.circle(
    windowDimensions.width / 2,
    windowDimensions.height / 2,
    windowDimensions.width > 1024 ? 150 : 100,
    {
      isStatic: true,
      render: { fillStyle: "transparent" },
    }
  );
  const handleRemove = (label: string) => {
    const box = getBoxProps(label);
    if (!box) {
      return;
    }
    const coordinates = generateRandomCoordinates();
    updatePositions(label, coordinates.x, coordinates.y, box.angle);
    removeCapturedBox(label); // Call the remove function with the box label
  };
  useEffect(() => {
    if (typeof window !== undefined) {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  const updatePositionsDebounced = useCallback(
    updatePositions, // Debounce to delay execution
    []
  );
  const addCapturedBoxDebounced = useCallback(
    _.debounce(addCapturedBox, 0), // Debounce to delay execution
    []
  );

  useEffect(() => {
    //if loading animation is active, turn it off because, it should not be active during onboarding process
    if (loading) {
      setLoading(false);
    }
  }, [step]);
  //use effect for rendering physics engine
  useEffect(() => {
    //physics engine
    const engine = Matter.Engine.create();
    //zero gravity
    engine.gravity.y = 0;
    //render the engine on refrence div
    const render = Matter.Render.create({
      element: sceneRef.current!,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false, // Disable wireframes to avoid default rendering
      },
    });

    if (!ellipse) {
      return;
    }
    // Scale to create an elliptical shape
    Matter.Body.scale(ellipse, 1.8, 1);
    //bounderies to prevent items from leaving screen
    const boundaries = [
      boundary(window.innerWidth / 2, -25, window.innerWidth, 50), //top
      boundary(
        window.innerWidth / 2,
        window.innerHeight,
        window.innerWidth,
        50
      ), //bottom
      boundary(-25, window.innerHeight / 2, 50, window.innerHeight), //left
      boundary(
        window.innerWidth + 25,
        window.innerHeight / 2,
        50,
        window.innerHeight
      ),
    ];
    //for each text...
    const boxes = recordedText
      .map((text) => {
        //check if the box hasn't already been captured. if so, skip it because otherwise it would be in two places at the same time
        if (capturedBoxes.includes(text)) return null;
        //helper function for calculating text width and random rotation angle
        const { textWidth, randomRotation } = calculateBoxData(text, render);
        //get properties from box if it exists already
        const existingBox = getBoxProps(text);
        //generate random coordinates for each box
        const randomCoordinates = generateRandomCoordinates();
        updatePositionsDebounced(
          text,
          randomCoordinates.x,
          randomCoordinates.y,
          randomRotation
        );
        //create a box
        return BoxObject(text, states, textWidth, existingBox?.angle);
      })
      .filter((box): box is Matter.Body => box !== null); //filter out all null values so we dont add them to the world
    setUncapturedBoxes(boxes.slice());
    //add boxes, bounds, orb and microphone to the world

    Matter.World.add(engine.world, [...boxes, ...boundaries, orb, ellipse]);

    //get mouse on canvas to enable dragging the items
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    Matter.World.add(engine.world, mouseConstraint);

    //function for checking collision between orb and items
    const checkCollisions = () => {
      // Update uncapturedBoxes based on captured boxes to avoid stale values
      setUncapturedBoxes((prevUncaptured) =>
        prevUncaptured.filter((box) => {
          const collision = Matter.Collision.collides(box, orb);

          updatePositionsDebounced(
            box.label,
            box.position.x,
            box.position.y,
            box.angle
          );

          if (collision && !capturedBoxes.includes(box.label as string)) {
            const randomCoordinates = generateRandomCoordinates();
            addCapturedBox(box.label as string, page);
            //if a box is caught, give it random coordinates so it doest rerender inside the center orb if its removed, creating infinite loop
            updatePositions(
              box.label,
              randomCoordinates.x,
              randomCoordinates.y,
              box.angle
            );
            Matter.World.remove(engine.world, box);
            return false; // Exclude captured box
          }
          return true; // Keep uncaptured box
        })
      );
    };

    //update 60 times per second (60fps)
    const update = () => {
      Matter.Engine.update(engine, 1000 / 60);
      //check for collision each frame
      checkCollisions();
      //The requestAnimationFrame() method of the DedicatedWorkerGlobalScope interface tells the browser you wish to perform an animation frame request and call a user-supplied callback function before the next repaint.
      requestAnimationFrame(update);
    };

    update();

    //run it
    Matter.Render.run(render);
    //some clean up
    return () => {
      Matter.Render.stop(render);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.canvas = null!;
      render.context = null!;
    };
  }, [capturedBoxes, recordedText, step]);

  return (
    <>
      <div className="relative z-[1]" ref={sceneRef} />
      {page !== "role_select" && ( //if page is not role select show the centerorb with bubles, else you should see the wheelpicker component
        <>
          <Microphone />
          <div
            className={`z-10 absolute shadow-[inset_0px_0px_50px] shadow-purple absolute_center orb_styling flex flex-col justify-center items-center text-center 
       transition-all duration-300 `}
      style={{width: orbDementions, height: orbDementions}}
          >
            <div ref={orbref} className="gap-4 m-12 flex justify-center items-center flex-col">
              {capturedBoxes.length > 0
                ? capturedBoxes.map((box, index) => (
                    <div className="flex items-center justify-center w-full" key={box}>
                      <Bubble
                        label={box}
                        inOrb
                        onClick={() => handleRemove(box)}
                      />
                    </div>
                  ))
                : orbText(page)}

              {capturedBoxes.length > 0 && (
                <div className="max-w-64">
                    <Button
                      text="Ga Verder!"
                      onClick={handleClick}
                      buttonType={ButtonType.Primary}
                    />
                </div>
              )}
            </div>
          </div>
          {states.length > 0 &&
            states.map(
              (box) =>
                !capturedBoxes.includes(box.label) && (
                  <Bubble
                    key={box.label}
                    label={box.label}
                    x={box.x}
                    y={box.y}
                    angle={box.angle}
                    inOrb={false}
                  />
                )
            )}
        </>
      )}
      <input
        className="bg-slate-200 text-black cursor-pointer z-[99] absolute top-20 left-0"
        type="text"
        onBlur={(event) => {
          if (
            characters.length > 0 &&
            event.target.value === characters[0].name
          ) {
            window.alert("you can't have the same character twice");
            return;
          }
          addRecordedText(event.target.value);
        }}
      />
    </>
  );
};

export default PhysicsComponent;
