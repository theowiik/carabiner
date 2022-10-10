import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import {
  IBulletPointService,
  LocalStorageRepository,
} from '../services/bullet-point-service';

// TODO: Ensure no cyclic dependencies on changes
export type NodeX = {
  id: number;
  parent: number | undefined;
  content: string;
  checked: boolean;
  expanded: boolean;
};

const Home: NextPage = () => {
  const [nodes, setNodes] = useState(createSampleNodes());
  const [root, setRoot] = useState<NodeX | null>(null);
  const repo: IBulletPointService = new LocalStorageRepository();

  useEffect(() => {
    repo.get().then((data) => {
      console.log('go', data);
    });
  }, []);

  function save(): void {
    const temp: NodeX[] = nodes;
    repo.save(temp);
  }

  function countNodes(nodes: NodeX[]): number {
    if (!nodes) return 0;
    return nodes.length;
  }

  function toggleCheck(node: NodeX): void {
    if (!node) return;
    setNodes(
      nodes.map((n) => (n === node ? { ...n, checked: !n.checked } : n))
    );
  }

  function toggleExpanded(node: NodeX): void {
    if (!node) return;
    setNodes(
      nodes.map((n) => (n === node ? { ...n, expanded: !n.expanded } : n))
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

  function buildTree(innerNode: NodeX, level: number): any {
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
                  <p>
                    <b>Current:</b>{' '}
                    <button
                      className="button is-text is-small"
                      onClick={() => save()}
                    >
                      save
                    </button>
                  </p>
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
