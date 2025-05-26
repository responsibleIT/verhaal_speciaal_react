// import '../globals.css';

export default function Start() {
  return (
    <><>
      <p>testing</p>
    </>
    <div className="relative w-full h-screen overflow-hidden">
        <img
          src="/images/landscape.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute top-8 sm:top-12 md:top-16 left-0 w-1/3 max-w-xs">
          <img
            src="/images/cloud_name.png"
            alt="Verhaal Speciaal"
            className="w-full h-auto" />
        </div>
        <div className="absolute right-10 sm:right-20 md:right-36 lg:right-48 bottom-1/4 w-1/3 max-w-xs">
          <img
            src="/images/reading_fox.png"
            alt="Reading Fox"
            className="w-full h-auto" />
        </div>
      </div></>
  );
}