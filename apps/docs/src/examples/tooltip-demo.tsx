import { Button, Tooltip } from '@uswds-tailwind/react'

export default function TooltipDemo() {
  return (
    <div className="flex flex-wrap justify-center gap-4 py-12">
      <Tooltip content="Top tooltip" position="top"><Button>Top</Button></Tooltip>
      <Tooltip content="Right tooltip" position="right"><Button>Right</Button></Tooltip>
      <Tooltip content="Bottom tooltip" position="bottom"><Button>Bottom</Button></Tooltip>
      <Tooltip content="Left tooltip" position="left"><Button>Left</Button></Tooltip>
    </div>
  )
}
