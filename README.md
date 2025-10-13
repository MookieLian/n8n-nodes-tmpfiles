# n8n-nodes-tmpfiles

This is an n8n community node for using the `tmpfiles.org` service in your n8n workflows. It uploads a binary file and returns a temporary download URL.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) automation platform.

- [Installation](#installation)
- [Supported Operations](#supported-operations)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Usage](#usage)
- [Resources](#resources)
- [Version History](#version-history)

---

Profile: https://gravatar.com/mookielian

---

## Installation

Follow the official guide: [Community nodes installation](https://docs.n8n.io/integrations/community-nodes/installation/)

Quick steps:

1. In n8n UI → Settings → Community Nodes → Install a community node
2. Package name: `n8n-nodes-tmpfiles`
3. Click Install and restart n8n if prompted

For self-hosted CLI:

```bash
npm install n8n-nodes-tmpfiles
```

## Supported Operations

- Upload File: Accepts a binary field, uploads it to `tmpfiles.org` API, and returns a temporary URL.

## Credentials

- Not required. `tmpfiles.org` does not require authentication.

## Compatibility

- n8n Nodes API Version: 1
- Tested with current n8n versions. No known incompatibilities.

## Usage

1. Add the `Tmpfiles` node to your workflow.
2. Set `Input Data Field Name` to the name of your binary property (e.g., `data`).
3. Execute the node; the output contains the temporary URL of the uploaded file.

Tip: Chain this after a node that provides binary data (e.g., HTTP Request / Read Binary File).

## Resources

- [n8n community nodes docs](https://docs.n8n.io/integrations/#community-nodes)
- `tmpfiles.org` API: `https://tmpfiles.org/api/v1/upload`

## Version History

- 0.1.0: Initial release
