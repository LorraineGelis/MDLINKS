const { mdLinks, readMdFile } = require('../index');

/* describe('mdLinks', () => {

  it('should...', () => {
    console.log('FIX ME!');
  });

}); */

describe('readMdFile', () => {
    it('Debería ser a function', () => {
        expect(typeof readMdFile).toEqual('function');
    });
    /*  it('Debería retornar un array', () => {
         return readMdFile("prueba.md").then(result => {
             expect(typeof result).toBe('array');
         })
     }) */
});