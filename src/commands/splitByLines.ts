import * as vsc from "vscode";

export default function divideByLines(
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
		const 
			positions: number[] = tEditor.selections.reduce((acc,v) => {
				acc.push(v.start.line);
				acc.push(v.end.line);
				return acc;
			}, new Array).sort((a,b) => a < b ? -1: a > b ? 1 : 0),
			[firstLineNum, lastLineNum] = [positions[0], positions[positions.length - 1]],
			commonLineCount = lastLineNum - firstLineNum + 1,
			commonCursorCount = tEditor.selections.length;

		console.log(`positions >>`, positions);

		console.log(`firstLineNum >>`, firstLineNum);
		console.log(`lastLineNum >>`, lastLineNum);
		console.log(`commonLineCount >>`, commonLineCount);
		console.log(`commonCursorCount >>`, commonCursorCount);

		if (1 < commonLineCount) {
			
			if (1 === commonCursorCount) {
				const lineNumbers: number[] = [];
				for (let i = firstLineNum; i <= lastLineNum; i ++) {
					lineNumbers.push(i);
				}
				tEditor.selections = getSelectionsByLines(doc, lineNumbers);
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
					
				console.log(`calcLineCount >>`, calcLineCount);
				console.log(`calcCursorCount >>`, calcCursorCount);
				console.log(`step >>`, step);
				
				for (;step <= calcLineCount; step ++) {
					if (calcLineCount % step) {continue;} else {break;}
				}
				console.log(`step >>`, step);

				for (let i = firstLineNum; i <= lastLineNum; i += step) {
					lineNumbers.push(i);
				}
				lineNumbers.push(lastLineNum);
				
				console.log(`lineNumbers >>`, lineNumbers);
				
				tEditor.selections = getSelectionsByLines(doc, lineNumbers);
			}
			
			// tEditor.selections = newSelections;
		} else {
			vsc.window.showWarningMessage("Fail!");
		}
	});
}

function getSelectionsByLines(doc: vsc.TextDocument, lineNumbers: number[])
: vsc.Selection[] {
	return lineNumbers.map(v => {
		const {start, end} = doc.lineAt(v).range;
		return new vsc.Selection(end, end);
	});
}
