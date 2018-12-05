import React from 'react';
import { Select } from '@blueprintjs/select';

type Props = {
    dPath: Array<any>,
    handleSelectPath: () => Promise<void>
};

const PathSelectorRenderer = (props: Props) => {
    return (
        <div>
            <select onChange={(e) => props.handleSelectPath(e.target.value)}>
                {props.dPath.map(path => {
                    return (
                        <option
                            key={path.path}
                            value={path.path}
                        >
                            {path.path}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default PathSelectorRenderer;
