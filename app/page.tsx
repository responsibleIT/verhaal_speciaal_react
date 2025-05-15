import React from "react";

import { draftMode } from "next/headers";

export default async function Home() {
  const { isEnabled } = draftMode();

  return (
    <>
      <p>Hello world</p>
    </>
  );
}
