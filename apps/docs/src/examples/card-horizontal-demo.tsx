import { Button } from '@uswds-tailwind/react/button'
import { Card } from '@uswds-tailwind/react/card'

export default function CardHorizontalDemo() {
  return (
    <div className="space-y-4">
      <Card.Root layout="ltr">
        <Card.Media>
          <img className="size-full object-cover" src="/assets/images/preview.jpg" alt="" />
        </Card.Media>
        <Card.Header>
          <Card.Title>Media left</Card.Title>
        </Card.Header>
        <Card.Body>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis earum tenetur quo.</p>
        </Card.Body>
        <Card.Footer>
          <Button type="button">Visit agency</Button>
        </Card.Footer>
      </Card.Root>
      <Card.Root layout="rtl">
        <Card.Media>
          <img className="size-full object-cover" src="/assets/images/preview.jpg" alt="" />
        </Card.Media>
        <div>
          <Card.Header>
            <Card.Title>Media right</Card.Title>
          </Card.Header>
          <Card.Body>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis earum tenetur quo.</p>
          </Card.Body>
          <Card.Footer>
            <Button type="button">Visit agency</Button>
          </Card.Footer>
        </div>
      </Card.Root>
    </div>
  )
}
