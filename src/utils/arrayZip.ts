// No Array.zip in JS :(
// Generic adapatation of: https://stackoverflow.com/a/22015930
export const arrayZip = <A, B>(a: A[], b: B[]): [A, B][] =>
    Array.from(Array(Math.max(b.length, a.length)), (_, i) => [a[i], b[i]]);
