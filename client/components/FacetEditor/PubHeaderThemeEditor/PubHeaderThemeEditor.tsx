import { PubHeaderTheme } from 'facets/intrinsics';

import { createFacetEditor } from '../createFacetEditor';
import BackgroundColorPicker from './BackgroundColorPicker';
import BackgroundImagePicker from './BackgroundImagePicker';
import TextStylePicker from './TextStylePicker';

export default createFacetEditor(PubHeaderTheme, {
	backgroundImage: BackgroundImagePicker,
	backgroundColor: BackgroundColorPicker,
	textStyle: TextStylePicker,
});
