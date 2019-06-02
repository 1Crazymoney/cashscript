import * as fs from 'fs';
import { parseCode } from '../util';
import SymbolTableTraversal from '../compiler/semantic/SymbolTableTraversal';
import TypeCheckTraversal from '../compiler/semantic/TypeCheckTraversal';
import GenerateTargetTraversal from '../compiler/generation/GenerateTargetTraversal';
import { generateAbi, Abi } from './ABI';
import { Ast } from '../compiler/ast/AST';

export function compile(code: string): Abi {
  let ast = parseCode(code);
  ast = ast.accept(new SymbolTableTraversal()) as Ast;
  ast = ast.accept(new TypeCheckTraversal()) as Ast;
  const traversal = new GenerateTargetTraversal();
  ast.accept(traversal);
  const targetCode = traversal.output;

  return generateAbi(ast, targetCode);
}

export function compileFile(codeFile: string): Abi {
  const code = fs.readFileSync(codeFile, { encoding: 'utf-8' });
  return compile(code);
}

export { Contract, Sig } from './Contract';