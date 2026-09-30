import { Button } from '@uswds-tailwind/react/button'
import { Card } from '@uswds-tailwind/react/card'

export default function CardVerticalDemo() {
  return (
    <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
      <Card.Root>
        <Card.Media>
          <img className="size-full object-cover" src="https://uswds-tailwind.com/assets/images/preview.jpg" alt="" />
        </Card.Media>
        <Card.Header>
          <Card.Title>Card title</Card.Title>
        </Card.Header>
        <Card.Body>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis earum tenetur quo.</p>
        </Card.Body>
        <Card.Footer>
          <Button type="button">Visit agency</Button>
        </Card.Footer>
      </Card.Root>
      <Card.Root>
        <Card.Media variant="flush">
          <img className="size-full object-cover" src="https://uswds-tailwind.com/assets/images/preview.jpg" alt="" />
        </Card.Media>
        <Card.Header>
          <Card.Title>Flush media</Card.Title>
        </Card.Header>
        <Card.Body>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis earum tenetur quo.</p>
        </Card.Body>
        <Card.Footer>
          <Button type="button">Visit agency</Button>
        </Card.Footer>
      </Card.Root>
      <Card.Root>
        <Card.Media variant="exdent" className="order-0 py-2">
          <img className="size-full object-cover" src="https://uswds-tailwind.com/assets/images/preview.jpg" alt="" />
        </Card.Media>
        <Card.Header className="order-first">
          <Card.Title>Header first</Card.Title>
        </Card.Header>
        <Card.Body>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis earum tenetur quo.</p>
        </Card.Body>
        <Card.Footer>
          <Button type="button">Visit agency</Button>
        </Card.Footer>
      </Card.Root>
    </div>
  )
}
