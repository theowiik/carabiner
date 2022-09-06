import type { NextPage } from 'next';
import { useState } from 'react';

type Node = {
  id: number;
  content: string;
  checked: boolean;
  children: Node[];
};

const Home: NextPage = () => {
  const [nodes, setNodes] = useState(sample());

  function countNodes(nodes: Node[]): number {
    if (nodes === null || nodes === undefined || nodes.length === 0) return 0;

    let count = nodes.length;

    nodes.forEach((child: Node) => {
      count += countNodes(child.children);
    });

    return count;
  }

  function toggleCheck(node: Node): void {
    if (!node) return;

    node.checked = !node.checked;
    setNodes(nodes.map((n) => n)); // TODO: this is a hack to force a re-render
  }

  function sample(): Node[] {
    return [
      {
        id: 1,
        content: 'root',
        checked: false,
        children: [
          {
            id: 2,
            content: 'child1',
            checked: false,
            children: [
              { id: 3, content: 'grandchild1', checked: false, children: [] },
            ],
          },
          { id: 4, content: 'child2', checked: true, children: [] },
        ],
      },
    ];
  }

  return (
    <div className="container mt-5">
      <h1 className="is-size-1 has-text-weight-bold">carabiner</h1>

      {nodes.map((node) => {
        const x = 'test';

        function subtree(innerNode: Node, level: number): any {
          return (
            <div key={`tree${innerNode.id}`}>
              <p style={{ marginLeft: `${level * 30}px` }}>
                {innerNode?.content} {innerNode?.checked ? '✅' : ''}
                <button
                  className="button is-text is-small ml-2"
                  onClick={() => toggleCheck(innerNode)}
                >
                  {innerNode?.checked ? 'Uncheck' : 'Check'}
                </button>
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
        <div className="column is-6">
          <div
            style={{
              borderColor: '#03fc90',
              borderStyle: 'solid',
              borderRadius: '10px',
            }}
          >
            <div className="m-5">
              <p className="title">dev info</p>

              <p>
                <b>Total:</b> {countNodes(nodes)}
              </p>

              <p>
                <b>JSON Object:</b>
              </p>

              <pre>{JSON.stringify(nodes, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
