import { type RenderToPipeableStreamOptions, renderToPipeableStream } from 'react-dom/server';

export function render(_url: string, _ssrManifest?: string, options?: RenderToPipeableStreamOptions) {
  return renderToPipeableStream(undefined, options);
}
