console.log( "=== simpread option modals ===" )

import FocusOpt     from 'focusopt';
import ReadOpt      from 'readopt';

import { storage, STORAGE_MODE } from 'storage';
import * as msg     from 'message';
import {browser}    from 'browser';
import th           from 'theme';
import Notify       from 'notify';
import * as ss      from 'stylesheet';

import Button       from 'button';
import * as tooltip from 'tooltip';
import * as waves   from 'waves';
import * as dia     from 'dialog';

const root   = "simpread-option-root",
      rootjq = `.${root}`;

/**
 * Modals Rect component
 */
class Modals extends React.Component {

    // close modals
    close( restore = rollback() ) {
        dia.Close();
    }

    // save modals focus option
    save() {
        console.log( "modals click submit button.", storage.current )
        const code = storage.Setcur( storage.current.mode );
        if ( code != 0 ) {
            browser.runtime.sendMessage( msg.Add( msg.MESSAGE_ACTION.shortcuts, { url: window.location.href } ));
            if ( storage.current.mode == STORAGE_MODE.read ) browser.runtime.sendMessage( msg.Add( msg.MESSAGE_ACTION.browser_action, { code: storage.rdstcode, url: window.location.href }));
            code == 1 ? new Notify().Render( 0, "更新成功！" ) : new Notify().Render( 0, "更新成功，重新进入后生效！" )
        } else {
            new Notify().Render( 0, "没有改变任何内容。" );
        }
        this.close( false );
    }

    constructor( props ) {
        super( props );
    }

    componentDidMount() {
        waves.Render({ root: rootjq });
        tooltip.Render( rootjq );
    }

    render() {
        const Option = storage.current.mode == STORAGE_MODE.focus ? FocusOpt : ReadOpt;

        return (
            <dia.Dialog>
                <dia.Content>
                    <Option option={ storage.current } />
                </dia.Content>
                <dia.Footer>
                    <Button text="取 消" mode="secondary" waves="md-waves-effect" onClick={ ()=>this.close() } />
                    <Button text="确 认" waves="md-waves-effect" onClick={ ()=>this.save() } />
                </dia.Footer>
            </dia.Dialog>
        )

    }
}

/**
 * Roll back when cancel button click
 */
function rollback() {
    storage.Restore( storage.current.mode );
    if ( storage.current.mode == STORAGE_MODE.focus ) $( ".simpread-focus-root" ).css({ "background-color" : storage.current.bgcolor });
    if ( storage.current.mode == STORAGE_MODE.read ) {
        th.theme != storage.current.theme && th.Change( storage.current.theme );
        ss.FontFamily( storage.current.fontfamily );
        ss.FontSize( storage.current.fontsize );
        ss.Layout( storage.current.layout );
    }
}

/**
 * Modals Render
 */
function Render() {
    !dia.Popup( rootjq ) && dia.Open( <Modals/>, root );
}

export{ Render }