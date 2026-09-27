import { Button } from '@uswds-tailwind/react/button'
import { Card } from '@uswds-tailwind/react/card'

export default function CardGroupDemo() {
  return (
    <Card.Group className="grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3">
      <li>
        <Card.Root>
          <Card.Media>
            <img className="size-full object-cover" src="/assets/images/preview.jpg" alt="" />
          </Card.Media>
          <Card.Header>
            <Card.Title>Card title 1</Card.Title>
          </Card.Header>
          <Card.Body>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis earum tenetur quo.</p>
          </Card.Body>
          <Card.Footer>
            <Button type="button">Visit agency</Button>
          </Card.Footer>
        </Card.Root>
      </li>
      <li>
        <Card.Root>
          <Card.Media>
            <img className="size-full object-cover" src="/assets/images/preview.jpg" alt="" />
          </Card.Media>
          <Card.Header>
            <Card.Title>Card title 2</Card.Title>
          </Card.Header>
          <Card.Body>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis earum tenetur quo.</p>
          </Card.Body>
          <Card.Footer>
            <Button type="button">Visit agency</Button>
          </Card.Footer>
        </Card.Root>
      </li>
      <li>
        <Card.Root>
          <Card.Media>
            <img className="size-full object-cover" src="/assets/images/preview.jpg" alt="" />
          </Card.Media>
          <Card.Header>
            <Card.Title>Card title 3</Card.Title>
          </Card.Header>
          <Card.Body>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis earum tenetur quo.</p>
          </Card.Body>
          <Card.Footer>
            <Button type="button">Visit agency</Button>
          </Card.Footer>
        </Card.Root>
      </li>
    </Card.Group>
  )
}
