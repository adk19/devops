const { pick } = require("../src/helpers/pick.js");

describe("pick", () => {
  it("should pick specified properties from an object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = pick(obj, ["a", "c"]);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it("should return an empty object if no properties are specified", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = pick(obj, []);
    expect(result).toEqual({});
  });

  it("should ignore non-existent properties", () => {
    const obj = { a: 1, b: 2 };
    const result = pick(obj, ["a", "c"]);
    expect(result).toEqual({ a: 1 });
  });
});
