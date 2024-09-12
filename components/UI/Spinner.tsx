'use client';

import { CSSProperties } from 'react';
import Lottie from 'react-lottie-player';
import loadingAnimation from '@/public/animations/loading.json';

interface SpinnerProps {
  size?: number;
  style?: CSSProperties;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 100, style }) => {
  return (
    <div style={style}>
      <Lottie
        loop
        animationData={loadingAnimation}
        play
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default Spinner;
```

This code defines a React component called `Spinner` that renders a loading animation using the `Lottie` library and the `react-lottie-player` package. The component takes two optional props: `size` (a number representing the size of the animation in pixels) and `style` (a `CSSProperties` object for applying custom styles to the component).

The `Spinner` component renders a `div` element with the `style` prop applied, and inside it, it renders the `Lottie` component. The `Lottie` component is configured to loop the animation, play it automatically, and use the `loadingAnimation` data imported from the `@/public/animations/loading.json` file (assuming this file contains the animation data in JSON format). The `width` and `height` styles of the `Lottie` component are set based on the `size` prop.

You can use this `Spinner` component in your application to display a loading animation while waiting for data to load or during any asynchronous operation. For example, you could conditionally render the `Spinner` component based on the loading state of your data:

```tsx
import { useState, useEffect } from 'react';
import Spinner from '@/components/UI/Spinner';

const MyComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData()
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          {/* Render data */}
          {data}
        </div>
      )}
    </div>
  );
};
```

In this example, the `Spinner` component is rendered while `isLoading` is `true`, and the actual data is rendered once `isLoading` becomes `false` after the data is fetched successfully.