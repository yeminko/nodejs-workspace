const text = "Hello World";

const encoder = new TextEncoder();
const data = encoder.encode(text);

Deno.writeFile("message.txt", data).then(() => {
  console.log("File has been written successfully.");
});
