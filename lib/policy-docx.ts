import type { Block, Run } from "./policy";

/** Builds the policy as a docx Document. docx is imported lazily so it stays out of the first page bundle. */
async function buildDoc(blocks: Block[]) {
  const D = await import("docx");
  const FONT = "Arial";
  const runs = (rs: Run[], extra: { italics?: boolean | undefined; size?: number; bold?: boolean } = {}) =>
    rs.map((r) => new D.TextRun({
      text: r.text, font: FONT, bold: !!(r.bold || extra.bold), italics: !!extra.italics,
      ...(extra.size ? { size: extra.size } : {}), ...(r.blank ? { highlight: "yellow" } : {}),
    }));
  const border = { style: D.BorderStyle.SINGLE, size: 4, color: "999999" };
  const borders = { top: border, bottom: border, left: border, right: border };
  const children: (InstanceType<typeof D.Paragraph> | InstanceType<typeof D.Table>)[] = [];
  for (const b of blocks) {
    if (b.k === "title") children.push(new D.Paragraph({ children: runs(b.runs, { size: 36, bold: true }), spacing: { after: 120 } }));
    else if (b.k === "meta") children.push(new D.Paragraph({ children: runs(b.runs, { size: 18 }), spacing: { after: 240 } }));
    else if (b.k === "h") children.push(new D.Paragraph({ children: runs(b.runs, { size: 26, bold: true }), spacing: { before: 240, after: 80 } }));
    else if (b.k === "p") children.push(new D.Paragraph({ children: runs(b.runs, { size: 21, italics: b.italic }), spacing: { after: 120 } }));
    else if (b.k === "ul") for (const it of b.items) children.push(new D.Paragraph({ children: runs(it, { size: 21 }), bullet: { level: 0 }, spacing: { after: 60 } }));
    else if (b.k === "hr") children.push(new D.Paragraph({ children: [], border: { bottom: border }, spacing: { before: 120, after: 120 } }));
    else if (b.k === "table") {
      const cell = (rs: Run[], head = false) => new D.TableCell({ borders, children: [new D.Paragraph({ children: runs(rs, { size: 16, bold: head }) })] });
      children.push(new D.Table({
        width: { size: 100, type: D.WidthType.PERCENTAGE },
        rows: [
          new D.TableRow({ tableHeader: true, children: b.head.map((h) => cell([{ text: h }], true)) }),
          ...b.rows.map((r) => new D.TableRow({ children: r.map((c) => cell(c)) })),
        ],
      }));
    }
  }
  const doc = new D.Document({
    styles: { default: { document: { run: { font: FONT } } } },
    sections: [{ properties: { page: { size: { orientation: D.PageOrientation.PORTRAIT }, margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } } }, children }],
  });
  return { D, doc };
}

/** In the browser: a Blob for the download button. */
export async function policyDocx(blocks: Block[]): Promise<Blob> {
  const { D, doc } = await buildDoc(blocks);
  return D.Packer.toBlob(doc);
}

/** On the server: a Buffer for the results email attachment. */
export async function policyDocxBuffer(blocks: Block[]): Promise<Buffer> {
  const { D, doc } = await buildDoc(blocks);
  return D.Packer.toBuffer(doc);
}
