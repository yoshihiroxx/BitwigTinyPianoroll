import Theme from '../../app/models/Theme';

describe('Model Theme', () => {
  test('Theme can be Transrated from json, jsObject', () => {
    let theme = new Theme();
    theme = theme.setIn(['pianoroll', 'background', 'value'], 0x33ff00);
    const json = theme.toJSON();
    const obj = theme.toObject();
    const fromJson = new Theme(json);
    const fromObj = new Theme(obj);
    expect(fromJson).toEqual(theme);
    expect(fromObj).toEqual(theme);
  });
});
