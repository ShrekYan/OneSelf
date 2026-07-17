import json
import sys

def walk_node(nodes, guid, indent=0, scale=1.0):
    for node in nodes:
        if node.get('parentGuid') == guid:
            name = node.get('name', '').strip() or node['type']
            w = int(node['width'] * scale)
            h = int(node['height'] * scale)
            t = int(node.get('top', 0) * scale)
            l = int(node.get('left', 0) * scale)
            print('  ' * indent + '- %s:' % name)
            print('  ' * (indent+1) + 'size: %dx%d, pos: top=%d, left=%d' % (w, h, t, l))
            if 'fillPaints' in node and len(node['fillPaints']) > 0:
                for i, p in enumerate(node['fillPaints']):
                    if 'color' in p:
                        c = p['color']
                        r = int(c['r'])
                        g = int(c['g'])
                        b = int(c['b'])
                        a = c.get('a', 1)
                        print('  ' * (indent+1) + 'fill: #%02x%02x%02x, alpha=%s' % (r, g, b, a))
            if 'strokePaints' in node and len(node['strokePaints']) > 0:
                for i, p in enumerate(node['strokePaints']):
                    if 'color' in p:
                        c = p['color']
                        r = int(c['r'])
                        g = int(c['g'])
                        b = int(c['b'])
                        a = c.get('a', 1)
                        print('  ' * (indent+1) + 'stroke: #%02x%02x%02x, alpha=%s' % (r, g, b, a))
            if node['type'] == 'PARAGRAPH' and 'nodeText' in node:
                fs = int(node.get('fontSize', 14) * scale)
                text = node['nodeText'][:80]
                print('  ' * (indent+1) + 'text: "%s..."' % text)
                print('  ' * (indent+1) + 'fontSize: %dpx' % fs)
                if 'fillPaints' in node and len(node['fillPaints']) > 0:
                    c = node['fillPaints'][0]['color']
                    r = int(c['r'])
                    g = int(c['g'])
                    b = int(c['b'])
                    print('  ' * (indent+1) + 'color: #%02x%02x%02x' % (r, g, b))
            walk_node(nodes, node['guid'], indent + 1, scale)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python print-dsl-tree.py <dsl_file> [original_width]')
        sys.exit(1)
    
    dsl_file = sys.argv[1]
    original_width = int(sys.argv[2]) if len(sys.argv) > 2 else None
    
    dsl = json.load(open(dsl_file))
    nodes = dsl['pixDslNodes']
    
    if original_width:
        scale = 750 / original_width
    else:
        scale = 1.0
    
    root_guid = None
    for node in nodes:
        if node.get('parentGuid') is None or node.get('parentGuid') == '':
            root_guid = node['guid']
            break
    
    if root_guid:
        walk_node(nodes, root_guid, scale=scale)
    else:
        print('Root node not found')