Right - the cropped views make it much easier to see. The parent commit (`c0271168b`) has properly aligned icons and text in the large buttons, and the very next commit (`731387c6d`) breaks it by removing `size="large"`.

**Git reflog proof of the checkouts:**

```
efeb5d3ab checkout: moving from c0271168b to master
c0271168b checkout: moving from 731387c6d to 731387c6d~1
731387c6d checkout: moving from a6a5a55b4 to 731387c6d
a6a5a55b4 checkout: moving from master to a6a5a55b4
```

So the bisection result stands: **`731387c6d`** is the introducing commit. One-line removal of `size="large"` from the bulk action buttons, causing them to default to medium where the font-icon sizing doesn't match the smaller button metrics.
