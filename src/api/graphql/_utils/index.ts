import { FieldMetadata } from 'type-graphql';
import {
  ClassType,
  InputType,
  ObjectType,
  getMetadataStorage,
  registerEnumType,
} from 'type-graphql';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

const metadata = getMetadataStorage();

export function buildEnum<T extends ClassType>(
  Class: T,
  name: string,
): Record<keyof InstanceType<T>, keyof InstanceType<T>> {
  const enumObj = {} as Record<keyof InstanceType<T>, keyof InstanceType<T>>;

  metadata.fields.forEach(f => {
    if (f.target !== Class && !f.target.isPrototypeOf(Class)) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    enumObj[f.name as keyof InstanceType<T>] = f.name;
  });

  registerEnumType(enumObj, { name });

  return enumObj;
}

export interface Options {
  directives?: boolean;
}

export function buildType(
  BaseClass: ClassType,
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  buildFn: (f: FieldMetadata) => FieldMetadata | FieldMetadata[] | undefined,
  options?: Options,
) {
  @InputType()
  @ObjectType()
  class ChildClass {}

  metadata.fields.forEach(f => {
    if (f.target !== BaseClass && !f.target.isPrototypeOf(BaseClass)) return;

    f.getType(); // detect array type options, issue #3

    const field = buildFn(f);

    if (Array.isArray(field)) {
      field.forEach(field =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        metadata.fields.push({ ...field, target: ChildClass }),
      );
    } else if (field) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      metadata.fields.push({ ...field, target: ChildClass });
    }
  });

  if (options?.directives) {
    const fieldNames = metadata.fields
      .filter(f => f.target === ChildClass)
      .map(f => f.name);

    metadata.fieldDirectives.forEach(f => {
      if (f.target !== BaseClass && !f.target.isPrototypeOf(BaseClass)) return;

      if (fieldNames.includes(f.fieldName)) {
        metadata.fieldDirectives.push({ ...f, target: ChildClass });
      }
    });
  }

  return ChildClass;
}

export function Pick<T extends ClassType, K extends keyof InstanceType<T>>(
  BaseClass: T,
  names: K[],
  options?: Options,
): ClassType<Pick<InstanceType<T>, K>> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return buildType(
    BaseClass,
    f => (names.includes(f.name as K) ? f : undefined),
    options,
  );
}

export function Omit<T extends ClassType, K extends keyof InstanceType<T>>(
  BaseClass: T,
  names: K[],
  options?: Options,
): ClassType<Omit<InstanceType<T>, K>> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return buildType(
    BaseClass,
    f => (names.includes(f.name as K) ? undefined : f),
    options,
  );
}

export function Partial<
  T extends ClassType,
  K extends keyof InstanceType<T> = keyof InstanceType<T>,
>(
  BaseClass: T,
  names?: K[],
  options?: Options,
): ClassType<PartialBy<InstanceType<T>, K>> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return buildType(
    BaseClass,
    f =>
      !names || names.includes(f.name as K)
        ? { ...f, typeOptions: { ...f.typeOptions, nullable: true } }
        : f,
    options,
  );
}

export function Required<
  T extends ClassType,
  K extends keyof InstanceType<T> = keyof InstanceType<T>,
>(
  BaseClass: T,
  names?: K[],
  options?: Options,
): ClassType<RequiredBy<InstanceType<T>, K>> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return buildType(
    BaseClass,
    f =>
      !names || names.includes(f.name as K)
        ? { ...f, typeOptions: { ...f.typeOptions, nullable: false } }
        : f,
    options,
  );
}
