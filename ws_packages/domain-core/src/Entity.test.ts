import { describe, expect, it } from 'vitest';
import { Entity, type EntityCreateProps, type EntityProps, type EntitySystemProps } from './Entity';

// Define test props
interface TestCreateProps extends EntityCreateProps {
  name: string;
}

interface TestSystemProps extends EntitySystemProps {
  createdAt: Date;
}

type TestEntityProps = EntityProps<TestCreateProps, TestSystemProps>;

// Create a concrete implementation for testing
class TestEntity extends Entity<TestEntityProps> {
  constructor(props: TestCreateProps, id?: string) {
    const entityProps: TestEntityProps = {
      ...props,
      createdAt: new Date(),
    };
    super(entityProps, id);
  }

  get name(): string {
    return this.props.name;
  }
}

describe('Entity', () => {
  it('should create an entity with an ID', () => {
    const entity = new TestEntity({ name: 'Test Entity' });
    expect(entity.id).toBeDefined();
    expect(entity.name).toBe('Test Entity');
  });

  it('should create an entity with a provided ID', () => {
    const id = 'test-id';
    const entity = new TestEntity({ name: 'Test Entity' }, id);
    expect(entity.id).toBe(id);
  });

  it('should compare entities by ID', () => {
    const id = 'test-id';
    const entity1 = new TestEntity({ name: 'Test Entity 1' }, id);
    const entity2 = new TestEntity({ name: 'Test Entity 2' }, id);
    const entity3 = new TestEntity({ name: 'Test Entity 3' });

    expect(entity1.equals(entity2)).toBe(true);
    expect(entity1.equals(entity3)).toBe(false);
  });
});
