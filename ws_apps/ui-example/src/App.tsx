import { Button, Card } from '@repo-packages/ui';
import { useState } from 'react';

export function App() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    // Simulate an async operation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCount((prev) => prev + 1);
    setIsLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Component Examples</h1>

      <Card title="Button Examples" className="mb-4">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <Button onClick={handleClick} isLoading={isLoading}>
            Increment Counter
          </Button>
          <Button onClick={() => setCount(0)} disabled={count === 0}>
            Reset Counter
          </Button>
        </div>
        <p>Counter value: {count}</p>
      </Card>

      <Card title="Feature Card">
        <p>This is an example of the Card component being used to display content.</p>
        <p>It can be used to group related information and actions together.</p>
      </Card>

      <Card className="mt-4">
        <h3>Card without title prop</h3>
        <p>This card demonstrates that the title is optional.</p>
      </Card>
    </div>
  );
}
