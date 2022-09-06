import type { NextPage } from 'next';

type Row = {
  content: string;
  children: Row[];
};

const Home: NextPage = () => {
  const wasd: string = 'wasd';

  const roots: Row[] = [
    {
      content: 'root',
      children: [
        {
          content: 'child1',
          children: [{ content: 'grandchild1', children: [] }],
        },
      ],
    },
  ];

  return (
    <div className="container mt-5">
      <h1 className="is-size-1 has-text-weight-bold">carabiner</h1>

      <p className="mt-5 mb-5">sample</p>

      {roots.map((row, index) => {
        const x = 'test';

        function subtree(tree: Row): any {
          return (
            <div>
              <p>{tree?.content}</p>

              {tree.children.map((child) => {
                return subtree(child);
              })}
            </div>
          );
        }

        return subtree(row);
      })}
    </div>
  );
};

export default Home;
