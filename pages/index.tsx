import type { NextPage } from 'next';
import { useState } from 'react';
import { useSsrLocalStorage } from '../hooks';

// TODO: Ensure no cyclic dependencies on changes
export type NodeX = {
  id: number;
  parent: number | undefined;
  content: string;
  checked: boolean;
  expanded: boolean;
};

const Home: NextPage = () => {
  const [nodes, setNodes] = useSsrLocalStorage('nodes', createSampleNodes());
  const [root, setRoot] = useSsrLocalStorage<NodeX | null>('root', null);
  const [editingContent, setEditingContent] = useState<string | null>(null);

  function countNodes(nodes: NodeX[]): number {
    if (!nodes) return 0;
    return nodes.length;
  }

  function toggleCheck(node: NodeX): void {
    if (!node) return;
    setNodes((prevNodes) =>
      prevNodes.map((n) => (n === node ? { ...n, checked: !n.checked } : n))
    );
  }

  function toggleExpanded(node: NodeX): void {
    if (!node) return;
    setNodes((prevNodes) =>
      prevNodes.map((n) => (n === node ? { ...n, expanded: !n.expanded } : n))
    );
  }

  function getChildren(node: NodeX): NodeX[] {
    if (!node) return [];
    return nodes.filter((n: NodeX) => n.parent === node.id);
  }

  function createSampleNodes(): NodeX[] {
    return [
      {
        id: 1,
        parent: undefined,
        content: 'root',
        checked: false,
        expanded: true,
      },
      {
        id: 2,
        parent: 1,
        content: 'child1',
        checked: false,
        expanded: true,
      },
      {
        id: 3,
        parent: 2,
        content: 'grandchild1',
        checked: false,
        expanded: true,
      },
      {
        id: 4,
        parent: 1,
        content: 'child2',
        checked: true,
        expanded: true,
      },
    ];
  }

  function toggleFocused(node: NodeX): void {
    if (!node) return;

    if (root === node) setRoot(null);
    else setRoot(node);
  }

  function updateContent(node: NodeX): void {
    if (!node) return;

    const content = editingContent;
    if (!content) return;

    setNodes((prevNodes) =>
      prevNodes.map((n) => (n === node ? { ...n, content: content } : n))
    );
  }

  function startEditingContent(node: NodeX): void {}

  function buildTree(innerNode: NodeX, level: number): any {
    return (
      <div key={`tree${innerNode.id}`}>
        <div className="columns" style={{ marginLeft: `${level * 30}px` }}>
          <div className="column">
            <a
              onClick={() => toggleExpanded(innerNode)}
              className="is-unselectable"
            >
              {innerNode.expanded ? '⮟' : '➤'}
            </a>
          </div>

          <div className="column is-4">
            <input
              type="checkbox"
              name={`checkbox-node-${innerNode.id}`}
              id={`checkbox-node-${innerNode.id}`}
              className="mx-2"
              checked={innerNode.checked}
              onChange={() => toggleCheck(innerNode)}
            />
          </div>

          <div className="column">
            <button onClick={() => console.log('sub')}>save</button>

            <div className="columns">
              <div className="column is-3">
                <input
                  type="text"
                  className="input is-small"
                  defaultValue={innerNode.content}
                  onChange={(e) => setEditingContent(e.target.value)}
                  // onFocus={() => setEditingContent()}
                  onBlur={() => updateContent(innerNode)}
                  onDoubleClick={() => startEditingContent(innerNode)}
                  disabled={true}
                />
              </div>
            </div>

            <button
              className="button is-text is-small ml-2"
              onClick={() => toggleFocused(innerNode)}
            >
              toggle focus
            </button>

            <span>({innerNode.content})</span>
          </div>
        </div>

        {innerNode?.expanded &&
          getChildren(innerNode).map((child) => {
            return buildTree(child, level + 1);
          })}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="is-size-1 has-text-weight-bold">carabiner</h1>

      <p className="mb-5">path here</p>

      {root && buildTree(root, 0)}
      {!root &&
        nodes
          .filter((node) => node.parent === undefined)
          .map((node) => buildTree(node, 0))}

      <div className="columns mt-5">
        <div className="column">
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

              <div className="columns">
                <div className="column">
                  <pre>{JSON.stringify(nodes, null, 2)}</pre>
                </div>
                <div className="column">
                  <p>
                    <b>Saved:</b>
                  </p>
                  <pre>{JSON.stringify(nodes, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
