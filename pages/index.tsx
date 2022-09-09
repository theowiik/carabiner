import type { NextPage } from 'next';
import { useState } from 'react';

type Node = {
  id: number;
  content: string;
  checked: boolean;
  expanded: boolean;
  children: Node[];
};

const Home: NextPage = () => {
  const [nodes, setNodes] = useState(createSampleNodes());
  const [root, setRoot] = useState<Node | null>(null);

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
    forceRerender();
  }

  function toggleExpanded(node: Node): void {
    if (!node) return;

    node.expanded = !node.expanded;
    forceRerender();
  }

  function forceRerender(): void {
    setNodes(nodes.map((n) => n)); // TODO: this is a hack to force a re-render
  }

  function createSampleNodes(): Node[] {
    return [
      {
        id: 1,
        content: 'root',
        checked: false,
        expanded: true,
        children: [
          {
            id: 2,
            content: 'child1',
            checked: false,
            expanded: true,
            children: [
              {
                id: 3,
                content: 'grandchild1',
                checked: false,
                expanded: true,
                children: [],
              },
            ],
          },
          {
            id: 4,
            content: 'child2',
            checked: true,
            expanded: true,
            children: [],
          },
        ],
      },
    ];
  }

  function toggleFocused(node: Node): void {
    if (!node) return;

    if (root === node) setRoot(null);
    else setRoot(node);
  }

  function buildTree(innerNode: Node, level: number): any {
    return (
      <div key={`tree${innerNode.id}`}>
        <p style={{ marginLeft: `${level * 30}px` }}>
          <span>{innerNode.expanded ? '⬇️' : '➡️'}</span>
          <i>• </i>

          {innerNode?.checked ? (
            <s style={{ opacity: '10%' }}>{innerNode.content}</s>
          ) : (
            innerNode.content
          )}

          <button
            className="button is-text is-small ml-2"
            onClick={() => toggleCheck(innerNode)}
          >
            {innerNode?.checked ? 'Uncheck' : 'Check'}
          </button>
          <button
            className="button is-text is-small ml-2"
            onClick={() => toggleExpanded(innerNode)}
          >
            {innerNode?.expanded ? 'Fold up' : 'Expand'}
          </button>
          <button
            className="button is-text is-small ml-2"
            onClick={() => toggleFocused(innerNode)}
          >
            toggle focus
          </button>
        </p>

        {innerNode?.expanded &&
          innerNode.children.map((child) => {
            return buildTree(child, level + 1);
          })}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="is-size-1 has-text-weight-bold">carabiner</h1>

      {root && buildTree(root, 0)}
      {!root && nodes.map((node) => buildTree(node, 0))}

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
                <b>Root node:</b> {root ? 'root node info here' : 'default'}
              </p>

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
