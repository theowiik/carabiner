import type { NextPage } from 'next';

type Node = {
  id: number;
  content: string;
  children: Node[];
};

const Home: NextPage = () => {
  function countNodes(nodes: Node[]): number {
    if (nodes === null || nodes === undefined || nodes.length === 0) return 0;

    let count = nodes.length;

    nodes.forEach((child: Node) => {
      count += countNodes(child.children);
    });

    return count;
  }

  const nodes: Node[] = [
    {
      id: 1,
      content: 'root',
      children: [
        {
          id: 2,
          content: 'child1',
          children: [{ id: 3, content: 'grandchild1', children: [] }],
        },
        ,
        { id: 4, content: 'child2', children: [] },
      ],
    },
  ];

  return (
    <div className="container mt-5">
      <h1 className="is-size-1 has-text-weight-bold">carabiner</h1>

      <p className="mt-5 mb-5">sample</p>

      {nodes.map((node) => {
        const x = 'test';

        function subtree(innerNode: Node, level: number): any {
          return (
            <div key={`tree${innerNode.id}`}>
              <p style={{ marginLeft: `${level * 30}px` }}>
                {innerNode?.content}
              </p>

              {innerNode.children.map((child) => {
                return subtree(child, level + 1);
              })}
            </div>
          );
        }

        return subtree(node, 0);
      })}

      <div className="columns mt-5">
        <div className="column is-3 is-6-desktop">
          <div
            style={{
              borderColor: '#03fc90',
              borderStyle: 'solid',
              borderRadius: '10px',
            }}
          >
            <div className="m-2">
              <p className="title">dev info</p>

              <p>Total: {countNodes(nodes)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
