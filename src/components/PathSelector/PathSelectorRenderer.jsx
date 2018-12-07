import React from 'react';
import { HTMLSelect } from '@blueprintjs/core';

type Props = {
    dPath: Array<any>,
    handleSelectPath: () => Promise<void>
};

const PathSelectorRenderer = (props: Props) => {
    return (
        <div>
            <HTMLSelect fill large onChange={e => props.handleSelectPath(e.target.value)}>
                {props.dPath.map(path => {
                    return (
                        <option key={path.path} value={path.path}>
                            {path.path} ({path.desc})
                        </option>
                    );
                })}
            </HTMLSelect>
        </div>
    );
};

export default PathSelectorRenderer;
