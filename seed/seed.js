import axios from 'axios';
import { createHPCharacterTableSQL, createWandTableSQL, dropHPCharacterTableSQL, dropWandTableSQL, insertHPCharacterSQL, insertWandSQL } from './sql.js';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// usado para limitar la cantidad de registros que se guardan en la BD. Defina a undefined
// si desea guardar todos los registros.
const MAX_RECORDS = 1000;

const characterIndexToWandIndex  = {};

const loadAndSaveData = async () => {
	try {
		//limpiar tablas existentes.
		await connection.query(dropWandTableSQL);
		console.log('***tabla wand eliminada***');
		
		await connection.query(dropHPCharacterTableSQL);
		console.log('***tabla hp_character eliminada***');

        // crear tablas.
		await connection.query(createWandTableSQL);        
		console.log('***tabla wand creada***');

		await connection.query(createHPCharacterTableSQL);        
		console.log('***tabla hp_character creada***');
        
		//cargar información desde api ya existente.
        // api caída porque no se puede acceder a la url. :(
		// const data = await axios.get('http://hp-api.herokuapp.com/api/characters');
        
        // cargar informacion desde archivo json local (ya que la api original falló :( ).
        const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);
        const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/characters.json')));

		//guardar las varitas
		const wands = getWandDataToSave(data);
		await connection.query(insertWandSQL, [wands]);
		console.log('***varitas guardadas***');
    
		//guardar los personajes
		const characters = getCharacterDataToSave(data);
		await connection.query(insertHPCharacterSQL, [characters]);        
		console.log('***personajes guardados***');
    
	}catch(err){
		console.error(err.data);
	}
};

const getWandDataToSave = (data) => {
	const wands = data.map((character, i) => {
		const wand = [...Object.values(character.wand)];
		wand[3] = i + 1;
		if(wand[2] === '') {
			wand[2] = null;
		}
		return wand;
	}).filter((wand,i) => {
		const isValidWand = wand[0] || wand[1] || wand[2];
		if(isValidWand){
			characterIndexToWandIndex[i] = Object.keys(characterIndexToWandIndex).length;
		}else {
			characterIndexToWandIndex[i] === null;
		}
		return isValidWand;
	});
	return wands.slice(0, MAX_RECORDS);
};

const getCharacterDataToSave = (data) =>{
	const formattedCharacters = data.map((character, i) => {
		delete character['alternate_names'];
		delete character['alternate_actors'];
		delete character['actor'];
		const retVal = Object.values(character);
		retVal[5] = retVal[5] || null;
		retVal[10] = characterIndexToWandIndex[i] || characterIndexToWandIndex[i] === 0 ? characterIndexToWandIndex[i] + 1: null ;
		return retVal;
	});
	const characters = formattedCharacters.map((character) => Object.values(character));
	return characters.slice(0, MAX_RECORDS);
};

await loadAndSaveData();
process.exit(0);