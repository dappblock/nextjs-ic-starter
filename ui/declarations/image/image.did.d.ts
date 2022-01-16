import type { Principal } from '@dfinity/principal';
export type ImageId = string;
export type ImageObject = Array<number>;
export interface _SERVICE {
  'create' : (arg_0: ImageObject) => Promise<ImageId>,
  'delete' : (arg_0: ImageId) => Promise<undefined>,
  'getImageById' : (arg_0: ImageId) => Promise<[] | [ImageObject]>,
}
