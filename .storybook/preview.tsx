import React from "react";
import "../app/styles/global.scss";
import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        method: "",
        order: ["Base", "Atoms", "Molecules", "Organisms"],
        locales: "",
      },
    },
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      return (
        <>
          {/* ----------- For locally imported fonts: add css styling to make font styling apply */}
          {/* <style jsx global>
            {`
              @font-face {
                font-family: "monstra-bold";
                src: url("/fonts/MostraNuova-Bold.woff2") format("woff2");
                font-display: swap;
              }
              @font-face {
                font-family: "monstra";
                src: url("/fonts/MostraNuova-Regular.woff2") format("woff2");
                font-display: swap;
              }

              :root {
                font-family: "Rubik", sans-serif;
              }

              .h1,
              .h2,
              .h3,
              .h4,
              .h5,
              h1,
              h2,
              h3,
              h4,
              h5 {
                font-family: "monstra";
                text-transform: uppercase;
              }

              .h1.font-medium,
              .h2.font-medium,
              .h3.font-medium,
              .h4.font-medium,
              .h5.font-medium,
              .h1.font-semibold,
              .h2.font-semibold,
              .h3.font-semibold,
              .h4.font-semibold,
              .h5.font-semibold,
              .h1.font-bold,
              .h2.font-bold,
              .h3.font-bold,
              .h4.font-bold,
              .h5.font-bold,
              .h1.font-extrabold,
              .h2.font-extrabold,
              .h3.font-extrabold,
              .h4.font-extrabold,
              .h5.font-extrabold,
              .h1.font-black,
              .h2.font-black,
              .h3.font-black,
              .h4.font-black,
              .h5.font-black {
                font-family: "monstra-bold";
              }

              .big {
              }

              q,
              .q,
              .quote,
              blockquote {
                font-family: "monstra";
              }
            `}
          </style> */}
          <div>
            <Story />
          </div>
        </>
      );
    },
  ],
};

export const parameters = {
  layout: "fullscreen",
};

export default preview;
