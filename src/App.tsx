import React from 'react';

import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const App: React.VFC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="text-[22px] text-red-500">Hello World!</div>
    </QueryClientProvider>
  );
};

export default App;
