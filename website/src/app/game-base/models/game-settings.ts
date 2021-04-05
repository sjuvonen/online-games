enum ConfigurationType {
  Number = 'number',
  Range = 'range',
  Toggle = 'toggle',
}

export interface GameSettings {
  name: string
  settings: ConfigurationItem[]
}

interface ConfigurationItem {
  name: string
  label: string
  type: ConfigurationType
  value: any
}
