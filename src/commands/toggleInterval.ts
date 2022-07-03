import * as vsc from "vscode";

export default function toggleInterval(
	tEditor: vsc.TextEditor, 
	edit: vsc.TextEditorEdit, 
	...args: any[]
) {
	const 
		doc  = tEditor.document,
		opts = tEditor.options,
		EOL  = ["", "\n", "\r\n"][doc.eol],
		TAB  = opts.insertSpaces && typeof opts.tabSize === "number" ? 
		" ".repeat(opts.tabSize) : "\t",
		newSelections: vsc.Selection[] = [];
	
	tEditor.edit((edit) => {
		const config = vsc.workspace.getConfiguration('divide-selection', doc.uri);
		const 
			positions: number[] = tEditor.selections.reduce((acc,v) => {
				acc.push(v.start.line);
				acc.push(v.end.line);
				return acc;
			}, new Array).sort((a,b) => a < b ? -1: a > b ? 1 : 0),
			[firstLineNum, lastLineNum] = [positions[0], positions[positions.length - 1]],
			commonLineCount = lastLineNum - firstLineNum + 1,
			commonCursorCount = tEditor.selections.length;

		if (1 < commonLineCount) {
			
			if (1 === commonCursorCount) {
				const lineNumbers: number[] = [];
				for (let i = firstLineNum; i <= lastLineNum; i ++) {
					lineNumbers.push(i);
				}
				tEditor.selections = getSelectionsByLines(doc, lineNumbers, config);
			} else if (2 === commonCursorCount) {
				const 
					startP = doc.lineAt(firstLineNum).range.start,
					endP = doc.lineAt(lastLineNum).range.end;
				tEditor.selections = [new vsc.Selection(startP, endP)];
				
			} else {
				const 
					calcLineCount  : number = commonLineCount - 1,
					calcCursorCount: number = commonCursorCount - 1,
					lineNumbers  : number[] = [];
				let step: number = Math.ceil(calcLineCount / (calcCursorCount - 1));
				
				for (;step <= calcLineCount; step ++) {
					if (calcLineCount % step) {continue;} else {break;}
				}

				for (let i = firstLineNum; i <= lastLineNum; i += step) {
					lineNumbers.push(i);
				}
				
				tEditor.selections = getSelectionsByLines(doc, lineNumbers, config);
			}
		} else {
			vsc.window.showWarningMessage("You need to select a fev lines or put a fev cursors to different lines.");
		}
	});
}

function getSelectionsByLines(
	doc: vsc.TextDocument, 
	lineNumbers: number[], 
	config: vsc.WorkspaceConfiguration
)
: vsc.Selection[] {
	return lineNumbers.map(v => {
		const 
			text = doc.lineAt(v).text,
			re = /(?<indentText>(?<indent>^\s*)(?<text>.*))\s*$/,
			m = text.match(re) || {groups:{indent: "", text: "", indentText: ""}};
		let start: number = 0, end: number = 0;

		if (config.selectLineFrom === "start-of-line") {
			start = 0;
		} else if (config.selectLineFrom === "start-of-text") {
			start = m.groups?.indent.length || 0;
		} else if (config.selectLineFrom === "end-of-line") {
			start = text.length;
		} else if (config.selectLineFrom === "end-of-text") {
			start = m.groups?.indentText.length || 0;
		}

		if (config.selectLineTo === "start-of-line") {
			end = 0;
		} else if (config.selectLineTo === "start-of-text") {
			end = m.groups?.indent.length || 0;
		} else if (config.selectLineTo === "end-of-line") {
			end = text.length;
		} else if (config.selectLineTo === "end-of-text") {
			end = m.groups?.indentText.length || 0;
		}

		return new vsc.Selection(new vsc.Position(v, start), new vsc.Position(v, end));
		/* const {start, end} = doc.lineAt(v).range;
		return new vsc.Selection(end, end); */
	});
}
