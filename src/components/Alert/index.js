import React from 'react';
import Dialog from '../../ui/Dialog';

export default function Alert({title, children, onClose}) {
	return (
		<Dialog title={title}
            onClose={onClose}
            classes="dialog::small">
            {children}
        </Dialog>
	)
}