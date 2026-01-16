import preview from '../../.storybook/preview'
import { Dropdown } from './dropdown'

const meta = preview.meta({
  title: 'Components/Dropdown',
  component: Dropdown.Root,
})

const items = [
  { href: '#', label: 'One' },
  { href: '#', label: 'Two' },
  { href: '#', label: 'Three' },
]

export const Basic = meta.story({
  render: () => (
    <Dropdown.Root>
      <Dropdown.Trigger>Dropdown</Dropdown.Trigger>
      <Dropdown.Content>
        {items.map(item => (
          <Dropdown.Item>
            <Dropdown.Link href={item.href}>
              {item.label}
            </Dropdown.Link>
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  ),
})

const languages = [
  { code: 'ar', name: 'العربية', translation: 'Arabic' },
  { code: 'zh', name: '简体字', translation: 'Chinese - Simplified' },
  { code: 'en', name: 'English', translation: '' },
  { code: 'es', name: 'Español', translation: 'Spanish' },
  { code: 'fr', name: 'Français', translation: 'French' },
  { code: 'it', name: 'Italiano', translation: 'Italian' },
  { code: 'ru', name: 'Pусский', translation: 'Russian' },
]

export const LanguageSelector = meta.story({
  render: () => (
    <div className="flex justify-end">
      <Dropdown.Root>
        <Dropdown.Trigger>Languages</Dropdown.Trigger>
        <Dropdown.Content className="right-0">
          {languages.map(lang => (
            <Dropdown.Item key={lang.code}>
              <Dropdown.Link href="#">
                <span lang={lang.code}>
                  <strong>{lang.name}</strong>
                  {' '}
                  {lang.translation ? `(${lang.translation})` : null}
                </span>
              </Dropdown.Link>
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  ),
})
