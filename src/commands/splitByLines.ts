import * as vsc from "vscode";

export default function divideByLines(tEditor: vsc.TextEditor, edit: vsc.TextEditorEdit, ...args: any[]) {
	const 
		doc  = tEditor.document,
		opts = tEditor.options,
		EOL  = ["", "\n", "\r\n"][doc.eol],
		TAB  = opts.insertSpaces && typeof opts.tabSize === "number" ? 
		" ".repeat(opts.tabSize) : "\t",
		newSelections: vsc.Selection[] = [];
	
	tEditor.edit((edit) => {
		const 
			positions: number[] = tEditor.selections.reduce((a,v) => {
				a.push(v.start.line);
				a.push(v.end.line);
				return a;
			}, new Array).sort(),
			[firstLineNum, lastLineNum] = [positions[0], positions[positions.length - 1]],
			commonLineCount = lastLineNum - firstLineNum + 1;

		console.log(`firstLineNum >>`, firstLineNum);
		console.log(`lastLineNum >>`, lastLineNum);
		console.log(`commonLineCount >>`, commonLineCount);

		if (1 < commonLineCount) {
			const 
				selCount = tEditor.selections.length,
				breakPointCount = selCount === 1 ? commonLineCount : selCount,
				calcLineCount = commonLineCount - 1,
				calcBPCount = breakPointCount - 1,
				numbers: number[] = [];
			let step = Math.ceil(calcLineCount / calcBPCount);
			console.log(`breakPointCount >>`, breakPointCount);
			console.log(`step >>`, step);
			step ++;
			for (; step <= calcLineCount; step ++) {
				if (calcLineCount % step) {continue;} else {break;}
			}
			console.log(`step >>`, step);
			numbers.push(lastLineNum);

			for (let i = lastLineNum; firstLineNum <= i; i -= step) {
				numbers.push(i);
			}

			console.log(`numbers >>`, numbers);

			tEditor.selections = numbers.map(v => {
				const 
					{start, end} = doc.lineAt(v).range,
					newSel = new vsc.Selection(start, end);
				return newSel;
			});
			
			// tEditor.selections = newSelections;
		} else {
			vsc.window.showWarningMessage("Fail!");
		}
	});
}

function rangeToOffsets(doc: vsc.TextDocument, range: vsc.Range) {
	return [range.start, range.end].map(doc.offsetAt);
}

function offsetsToRange(doc: vsc.TextDocument, offsets: [number, number]): vsc.Range {
	const [a, b] = offsets.map(doc.positionAt);
	return new vsc.Range(a, b);
}