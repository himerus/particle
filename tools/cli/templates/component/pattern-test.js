import { name } from '..';

test('{{ dashCase name }} component is registered', () => {
  expect(name).toBe('{{ camelCase name }}');
});
