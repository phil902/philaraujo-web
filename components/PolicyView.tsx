import type { Block, Run } from "@/lib/policy";

const R = ({ runs }: { runs: Run[] }) => (
  <>
    {runs.map((r, i) => {
      const cls = r.blank ? "policy-blank" : undefined;
      return r.bold ? <strong key={i} className={cls}>{r.text}</strong> : <span key={i} className={cls}>{r.text}</span>;
    })}
  </>
);

export function PolicyView({ blocks }: { blocks: Block[] }) {
  return (
    <article className="policy-doc">
      {blocks.map((b, i) => {
        switch (b.k) {
          case "title": return <h1 key={i}><R runs={b.runs} /></h1>;
          case "meta": return <p key={i} className="policy-meta"><R runs={b.runs} /></p>;
          case "h": return <h2 key={i}><R runs={b.runs} /></h2>;
          case "p": return <p key={i} className={b.italic ? "italic" : undefined}><R runs={b.runs} /></p>;
          case "ul": return <ul key={i}>{b.items.map((it, j) => <li key={j}><R runs={it} /></li>)}</ul>;
          case "hr": return <hr key={i} />;
          case "table":
            return (
              <div key={i} className="policy-table-wrap">
                <table>
                  <thead><tr>{b.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                  <tbody>{b.rows.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k}><R runs={c} /></td>)}</tr>)}</tbody>
                </table>
              </div>
            );
        }
      })}
    </article>
  );
}
