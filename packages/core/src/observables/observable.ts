// eslint-disable-next-line import/no-cycle
import {
  createAutoObservableObject,
  type ObservableObjectWithAdmin,
  type ObservableObject,
  type ObservableObjectOptions,
  type AnnotationsMap,
} from "./observableObject";
// eslint-disable-next-line import/no-cycle
import { ObservableSet, type SetOptions, type ObservableSetWithAdmin } from "./observableSet";
// eslint-disable-next-line import/no-cycle
import { ObservableMap, type MapOptions, type ObservableMapWithAdmin } from "./observableMap";
// eslint-disable-next-line import/no-cycle
import {
  createObservableArray,
  type ObservableArray,
  type ArrayOptions,
  type ObservableArrayWithAdmin,
} from "./observableArray";
import {
  isDecoratorContext,
  isMap,
  isObject,
  isObservableArray,
  isObservableMap,
  isObservableSet,
  isSet,
} from "../utils/predicates";
import type { Any } from "../state/global";
import {
  createObservableValue,
  type ObservableValue,
  type ObservableValueOptions,
  type IObservableValueAdmin,
  type ObservableValueWithAdmin,
} from "./observableValue";

export interface IObservableCollectionAdmin<T = Any> extends IObservableValueAdmin<T> {
  changes: number;
  previous: string;
  current: string;
}

export type IObservable =
  | ObservableValueWithAdmin
  | ObservableObjectWithAdmin
  | ObservableArrayWithAdmin
  | ObservableMapWithAdmin
  | ObservableSetWithAdmin;

export const observable = ((obj: Any, a?: Any, b?: Any) => {
  if (isDecoratorContext(a)) {
    throw new Error('[@fobx/core] @observable decorator must be imported from "@fobx/core/decorators"');
  }

  if (isMap(obj)) {
    if (isObservableMap(obj)) return obj;
    return new ObservableMap(obj, a);
  } else if (isSet(obj)) {
    if (isObservableSet(obj)) return obj;
    return new ObservableSet(obj, a);
  } else if (Array.isArray(obj)) {
    if (isObservableArray(obj)) return obj;
    return createObservableArray(obj, a);
  } else if (isObject(obj)) {
    return createAutoObservableObject(obj, a, b);
  }
  return createObservableValue(obj, a);
}) as ObservableFactory;

export interface ObservableFactory {
  /**
   * Creates a new observable array based on the supplied array.
   * @param array the array to make observable.
   * @param options the array options.
   * @returns an observable array.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T = any>(array: Array<T>, options?: ArrayOptions): ObservableArray<T>;
  /**
   * Creates a new observable map based on the supplied map.
   * @param map the map to make observable.
   * @param options the map options.
   * @returns an observable map
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <K = any, V = any>(map: Map<K, V>, options?: MapOptions): ObservableMap<K, V>;
  /**
   * Creates a new observable set based on the supplied set.
   * @param set the set to make observable.
   * @param options the set options.
   * @returns an observable set.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T = any>(set: Set<T>, options?: SetOptions): ObservableSet<T>;
  /**
   * Creates a new observable object based on the supplied object.
   * @param obj the object to make observable
   * @param annotationOverrides overrides if the auto assigned annotations are not correct
   * @param options the object options
   * @returns an observable object.
   */
  <T extends object>(
    obj: T,
    annotationOverrides?: AnnotationsMap<T>,
    options?: ObservableObjectOptions
  ): ObservableObject<T>;
  /**
   * Creates a new observable value.
   * @param value the initial value for the observable.
   * @param options the observable value options.
   * @returns an observable value.
   */
  <T>(value: T, options?: ObservableValueOptions<T>): ObservableValue<T>;
}
