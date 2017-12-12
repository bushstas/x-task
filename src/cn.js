import classNamesMap from './components/cn';
import dialogClassNamesMap from './ui/Dialog/cn';


export default {
	prefix: 'x-task',
	map: classNamesMap,
	delimiter: '-',
	maps: {
		dialog: {
			map: dialogClassNamesMap,
			prefix: 'x-task-dialog'
		}
	}
}