package br.com.compiladores.analisadorLexico;

public class AnalisadorLexico {
	//Palavras reservadas do sistema
	public static String[] tokens = { "Program", "Var", ";", "Const", "Begin", "Read", "End.", ",", ":", "(", ")", "=",
			"+", "Write", "real", "*", ":=" };

	public Boolean analisaPalavras(Integer contador, String[] listaPalavras) {
		for (String lp : listaPalavras) {
			//Verifica se as palavras não possuem caracteres fora do esperado, caso tenham verifica se não é uma palavra reservada
			//Caso não sejau uma palavra reservada, retorna falso e portanto não se adequa ao esperado do compilador
			if (lp.matches("[a-zA-Z_0-9]*;?") || analisaPalavra(lp)) {
				continue;
			} else {
				return false;
			}
		}
		return true;
	}
	//Verifica se a palavra em questão é uma palavra reservada
	public Boolean analisaPalavra(String palavra) {
		for (String comparativo : tokens) {
			if (comparativo.equals(palavra)) {
				return true;
			}
		}
		return false;
	}
}
