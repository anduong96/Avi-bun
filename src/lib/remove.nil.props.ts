type NonNullableObject<T> = {
  [P in keyof T]: Exclude<T[P], undefined | null> extends infer U
    ? U extends object
      ? NonNullableObject<U>
      : U
    : never;
};

export function removeNilProp<T extends object>(obj: T): NonNullableObject<T> {
  const newObj = {} as NonNullableObject<T>;
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      if (typeof value === "object" && value.constructor.name === "Object") {
        newObj[key as keyof T] = removeNilProp(
          value
        ) as NonNullableObject<T>[keyof T];
      } else {
        newObj[key as keyof T] = value as NonNullableObject<T>[keyof T];
      }
    }
  }
  return newObj;
}
