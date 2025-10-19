import { Splitter } from '@ark-ui/react/splitter'

export default function ZagSplitter({ resize = true, children }: { resize: boolean, children: React.ReactNode }) {
  return (
    <Splitter.Root
      defaultSize={[100, 0]}
      panels={[{ id: 'a', collapsible: resize }, { id: 'b' }]}
    >
      <Splitter.Panel
        id="a"
        className="bg-gray-cool-2 shadow-[1px_0px_0px_#dfe1e2] p-4"
      >
        {children}
      </Splitter.Panel>
      {
        resize
          ? (
            <Splitter.ResizeTrigger
              id="a:b"
              aria-label="Resize"
              className="items-center p-2 group outline-none hidden tablet:flex"
            >
              <div className="flex max-h-32 h-full rounded-full w-1.5 bg-blue-60v group-hover:bg-blue-warm-70v group-active:bg-blue-warm-80v group-active:outline-4 group-active:outline-offset-4 group-active:outline-blue-40v group-focus:outline-4 group-focus:outline-offset-4 group-focus:outline-blue-40v" />
            </Splitter.ResizeTrigger>
          )
          : null
      }

      {resize ? <Splitter.Panel id="b" /> : null}
    </Splitter.Root>
  )
}
