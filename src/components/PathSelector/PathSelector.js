// @flow
import React from 'react';

import PathSelectorRenderer from './PathSelectorRenderer';

type Props = {
    dPath: Array<any>,
    handleSelectPath: () => Promise<void>
};

const PathSelector = (props: Props) => {
    return (
        <PathSelectorRenderer
            dPath={props.dPath}
            handleSelectPath={props.handleSelectPath}
        />
    );
};

export default PathSelector;
