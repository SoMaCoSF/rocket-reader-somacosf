# RRS Header Protocol

## The one-line contract

```
# RRS: https://rr.somacosf.com/e/<uuidv8>
```

or short form:

```
# RRS: <uuidv8>
```

## Placement

Prefer first 20 lines, after shebang, before main license when possible.

## Examples

Python:
```python
#!/usr/bin/env python3
# RRS: https://rr.somacosf.com/e/0192a1b3-8c4d-8e2f-9a1b-7c8d9e0f1a2b
```

Markdown:
```markdown
# RRS: 0192a1b3-8c4d-8e2f-9a1b-7c8d9e0f1a2b
# Title
```

## Resolver

`GET https://rr.somacosf.com/e/<uuidv8>` returns the Rocket Reader experience.

## Front-matter of every explainer

```yaml
---
id: <uuidv8>
version: uuidv8
source: path/to/file
model: ...
created: ISO8601
wpm_target: 300
tags: [...]
---
```

Body is pure flowing prose for clean RSVP.
