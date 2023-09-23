import { describe, expect, mock, test } from 'bun:test';
import { Singleton } from '../singleton';

describe('lib::Singleton', () => {
  test('create a single instance of the specified class', () => {
    class MyClass extends Singleton<MyClass>() {
      count = 0;

      increment() {
        this.count++;
      }
    }

    const mockFn = mock(() => instance.increment());
    const instance = MyClass.instance;
    expect(instance).toBeInstanceOf(MyClass);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(instance.increment).toBeTypeOf('function');
    expect(instance.count).toBe(0);

    mockFn();

    expect(mockFn).toHaveBeenCalled();
    expect(instance.count).toBe(1);
  });
});
