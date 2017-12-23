import React from 'react';
import ElementResizer from '../ElementResizer';

export default function Resizers({set, ...props}) {
	return (
		<span>
            {(!set || set == '1') && <ElementResizer position="t" classes="~t" {...props}/>}
	 		{(!set || set == '1') && <ElementResizer position="b" classes="~b" {...props}/>}
	 		{(!set || set == '1') && <ElementResizer position="l" classes="~l" {...props}/>}
	 		{(!set || set == '1') && <ElementResizer position="r" classes="~r" {...props}/>}
	 		{(!set || set == '2') && <ElementResizer position="lt" classes="~lt" {...props}/>}
	 		{(!set || set == '2') && <ElementResizer position="rt" classes="~rt" {...props}/>}
	 		{(!set || set == '2') && <ElementResizer position="rb" classes="~rb" {...props}/>}
	 		{(!set || set == '2') && <ElementResizer position="lb" classes="~lb" {...props}/>}
        </span>
	)
}