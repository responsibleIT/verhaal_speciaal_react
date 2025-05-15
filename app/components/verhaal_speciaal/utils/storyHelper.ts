  export function extractJson(response: string): string {
    const match = response.match(/\[([\s\S]*)\]/);
    // Zoekt naar een JSON-array
    return match ? match[0].replace(/,\s*(\}|\])$/, "$1").replace(/actor:/g, '"actor":').replace(/line:/g, '"line":') : ""; // Geeft de JSON-array terug of een lege string
  }